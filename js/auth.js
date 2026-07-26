// yunzhuan.icu - Supabase Auth & Database Integration
// Uses Supabase Auth (email) + Postgres with RLS

(function() {
    const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://otfjbzjvkoectpejhxar.supabase.co';
    const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anonKey || '';

    let supabase = null;
    let currentUser = null;
    let isReady = false;
    let readyCallbacks = [];

    function onReady(callback) {
        if (isReady) callback(currentUser);
        else readyCallbacks.push(callback);
    }

    function fireReady() {
        isReady = true;
        readyCallbacks.forEach(cb => {
            try { cb(currentUser); } catch (e) {}
        });
        readyCallbacks = [];
    }

    function loadSupabase(callback) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        script.onload = function() {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                callback();
            } else {
                callback(new Error('Supabase SDK load failed'));
            }
        };
        script.onerror = function() {
            callback(new Error('Supabase SDK load failed'));
        };
        document.head.appendChild(script);
    }

    async function init() {
        loadSupabase(async function(err) {
            if (err) {
                console.warn('[Auth] Supabase SDK load failed:', err.message);
                currentUser = null;
                fireReady();
                return;
            }

            try {
                const { data: { user } } = await supabase.auth.getUser();
                currentUser = user;

                supabase.auth.onAuthStateChange((event, session) => {
                    currentUser = session?.user || null;
                    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                        document.dispatchEvent(new CustomEvent('auth-change', {
                            detail: { user: currentUser, event }
                        }));
                    }
                });
            } catch (e) {
                console.warn('[Auth] Init error:', e.message);
                currentUser = null;
            }
            fireReady();
        });
    }

    const Auth = {
        ready: onReady,
        getUser: () => currentUser,
        isLoggedIn: () => !!currentUser,

        async signUp(email, password, options = {}) {
            if (!supabase) throw new Error('Not initialized');
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: options.data || {}
                }
            });
            if (error) throw error;
            return data;
        },

        async signIn(email, password) {
            if (!supabase) throw new Error('Not initialized');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            currentUser = data.user;
            return data;
        },

        async signOut() {
            if (!supabase) throw new Error('Not initialized');
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            currentUser = null;
        },

        async resetPassword(email) {
            if (!supabase) throw new Error('Not initialized');
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/login.html?reset=1'
            });
            if (error) throw error;
            return data;
        },

        async updatePassword(newPassword) {
            if (!supabase) throw new Error('Not initialized');
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            return data;
        }
    };

    const DB = {
        async getProfile() {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();
            if (error) throw error;
            return data;
        },

        async updateProfile(updates) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('user_profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', currentUser.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },

        async getFavorites(itemType = null) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            let query = supabase.from('favorites').select('*').order('created_at', { ascending: false });
            if (itemType) query = query.eq('item_type', itemType);
            const { data, error } = await query;
            if (error) throw error;
            return data;
        },

        async addFavorite(item) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('favorites')
                .insert({
                    user_id: currentUser.id,
                    item_type: item.type,
                    item_id: item.id,
                    item_title: item.title || null,
                    item_url: item.url || null,
                    item_meta: item.meta || null
                })
                .select()
                .single();
            if (error) {
                if (error.code === '23505') {
                    return await this.removeFavorite(item.type, item.id);
                }
                throw error;
            }
            return data;
        },

        async removeFavorite(itemType, itemId) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('item_type', itemType)
                .eq('item_id', itemId);
            if (error) throw error;
            return true;
        },

        async isFavorite(itemType, itemId) {
            if (!supabase || !currentUser) return false;
            const { data, error } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('item_type', itemType)
                .eq('item_id', itemId)
                .maybeSingle();
            if (error) throw error;
            return !!data;
        },

        async getProgress(progressType = null) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            let query = supabase.from('progress').select('*').order('last_updated', { ascending: false });
            if (progressType) query = query.eq('progress_type', progressType);
            const { data, error } = await query;
            if (error) throw error;
            return data;
        },

        async saveProgress(progressType, itemId, value, completed = false) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('progress')
                .upsert({
                    user_id: currentUser.id,
                    progress_type: progressType,
                    item_id: itemId,
                    progress_value: value,
                    completed: completed,
                    last_updated: new Date().toISOString()
                }, {
                    onConflict: 'user_id,progress_type,item_id'
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        },

        async getSchoolList() {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('school_list')
                .select('*')
                .order('added_at', { ascending: false });
            if (error) throw error;
            return data;
        },

        async addSchoolToList(school) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('school_list')
                .insert({
                    user_id: currentUser.id,
                    school_id: school.id,
                    school_name: school.name,
                    tier: school.tier || null,
                    status: school.status || 'considering',
                    notes: school.notes || null
                })
                .select()
                .single();
            if (error) {
                if (error.code === '23505') return null;
                throw error;
            }
            return data;
        },

        async removeSchoolFromList(schoolId) {
            if (!supabase || !currentUser) throw new Error('Not authenticated');
            const { error } = await supabase
                .from('school_list')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('school_id', schoolId);
            if (error) throw error;
            return true;
        }
    };

    window.Auth = Auth;
    window.DB = DB;

    if (typeof document !== 'undefined') {
        init();
    }
})();
