"use client";

import { motion } from "framer-motion";
import { Users, Search, Edit2, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { UserProfile } from "@/types/admin-ui";

interface UsersTabProps {
    users: UserProfile[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsEditing: (user: UserProfile) => void;
    handleUserDelete: (id: string) => Promise<void>;
}

export function UsersTab({ users, searchQuery, setSearchQuery, setIsEditing, handleUserDelete }: UsersTabProps) {
    const filteredUsers = users.filter((u) =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-black/20 overflow-hidden"
        >
            <div className="p-6 md:p-10 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-black font-display flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            Citizen Registry
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Manage user accounts, tiers, and administrative status</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80 md:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by identity..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl font-bold transition-all outline-none text-slate-900 dark:text-white shadow-sm text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block lg:hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className={`p-6 space-y-6 ${user.is_suspended ? 'bg-red-50/40 dark:bg-red-900/10' : 'bg-white dark:bg-slate-900'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden text-xl font-black text-slate-400 relative">
                                        <Avatar
                                            src={user.avatar_url}
                                            size="lg"
                                            fallback={user.username?.[0]?.toUpperCase() || 'U'}
                                            className="w-full h-full border-0 rounded-none bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white leading-tight">
                                            {user.username || 'Anonymous'}
                                            {user.is_suspended && <span className="ml-2 text-[8px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded uppercase tracking-widest font-black">Suspended</span>}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{user.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.is_premium
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                    }`}>
                                    {user.is_premium ? 'Elite' : 'Standard'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Source</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">
                                        {user.source || 'Direct'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">XP / Level</p>
                                    <p className="text-xs font-black text-primary">{user.total_xp?.toLocaleString()} <span className="text-[10px]">lvl {user.level}</span></p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setIsEditing(user)} className="flex-1 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 active:scale-95 transition-transform"><Edit2 className="w-3.5 h-3.5" /> Edit Profile</button>
                                <button onClick={() => handleUserDelete(user.id)} className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-xl font-black text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-2 active:scale-95 transition-transform"><Trash2 className="w-3.5 h-3.5" /> Terminate</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-y-2 border-slate-100 dark:border-slate-800">
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Citizen Identity</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Acquisition</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Progression</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50 dark:divide-slate-800">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${user.is_suspended ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center text-xl font-black text-slate-400 group-hover:scale-110 transition-transform">
                                            <Avatar
                                                src={user.avatar_url}
                                                size="lg"
                                                fallback={user.username?.[0]?.toUpperCase() || 'U'}
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white leading-tight">
                                                {user.username || 'Anonymous'}
                                                {user.is_suspended && <span className="ml-2 text-[8px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black">Suspended</span>}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{user.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.is_premium
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                        }`}>
                                        {user.is_premium ? 'Elite' : 'Standard'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {user.source || 'Direct'}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-primary">{user.total_xp?.toLocaleString()} <span className="text-slate-400 font-bold ml-1">XP</span></p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Tier {user.level}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setIsEditing(user)} className="p-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all active:scale-95"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleUserDelete(user.id)} className="p-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-600/30 transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                        <Search className="w-12 h-12 mb-4 opacity-10" />
                        <p className="font-bold italic text-sm">No citizens match your search criteria.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
