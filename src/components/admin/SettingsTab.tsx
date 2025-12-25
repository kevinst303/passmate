"use client";

import { motion } from "framer-motion";
import {
    Settings as SettingsIcon,
    Cpu,
    CreditCard,
    Bell,
    ShieldCheck,
    Save,
    Globe,
    Trophy,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SettingsTabProps {
    settingsForm: any;
    setSettingsForm: (form: any) => void;
    handleSaveConfig: (keys: string[]) => Promise<void>;
    loading: boolean;
}

export function SettingsTab({ settingsForm, setSettingsForm, handleSaveConfig, loading }: SettingsTabProps) {
    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Configuration Sidebar/Menu */}
            <div className="space-y-4">
                {[
                    { id: 'ai', icon: Cpu, label: 'AI Engine', desc: 'Gemini, prompt & models', color: 'purple' },
                    { id: 'stripe', icon: CreditCard, label: 'Payments', desc: 'Webhooks & Stripe keys', color: 'blue' },
                    { id: 'app', icon: Bell, label: 'App Config', desc: 'Maintenance & Alerts', color: 'orange' },
                ].map((cat) => (
                    <button
                        key={cat.id}
                        className="w-full text-left p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-primary dark:hover:border-primary/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 outline-none"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${cat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 group-hover:bg-purple-600' : ''}
                                ${cat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:bg-blue-600' : ''}
                                ${cat.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 group-hover:bg-orange-600' : ''}
                                group-hover:text-white group-hover:scale-110 group-hover:rotate-3`}>
                                <cat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{cat.label}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">{cat.desc}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Configuration Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* AI Settings Group */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-bl-full -mr-32 -mt-32" />

                    <div className="relative z-10 flex items-center justify-between">
                        <h4 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900 dark:text-white tracking-tight">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600">
                                <Cpu className="w-6 h-6" />
                            </div>
                            AI Engine
                        </h4>
                        <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-purple-100 dark:border-purple-800">Operational</span>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 ml-2">Provider</label>
                                <select
                                    value={settingsForm.ai_provider}
                                    onChange={e => setSettingsForm({ ...settingsForm, ai_provider: e.target.value })}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none appearance-none"
                                >
                                    <option value="google">Google Gemini</option>
                                    <option value="openai">OpenAI</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 ml-2">Model</label>
                                <select
                                    value={settingsForm.ai_model}
                                    onChange={e => setSettingsForm({ ...settingsForm, ai_model: e.target.value })}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none appearance-none"
                                >
                                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-2">API Secret Key</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={settingsForm.ai_key}
                                    onChange={e => setSettingsForm({ ...settingsForm, ai_key: e.target.value })}
                                    placeholder="••••••••••••••••"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-2">System Instructions Override</label>
                            <textarea
                                value={settingsForm.ai_instructions}
                                onChange={e => setSettingsForm({ ...settingsForm, ai_instructions: e.target.value })}
                                className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-[2rem] font-bold outline-none min-h-[120px]"
                                placeholder="You are Ollie the Koala, an AI tutor for..."
                            ></textarea>
                        </div>

                        <Button
                            onClick={() => handleSaveConfig(['ai_provider', 'ai_model', 'ai_key', 'ai_instructions'])}
                            disabled={loading}
                            className="w-full h-14 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20"
                        >
                            {loading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save AI Configuration</>}
                        </Button>
                    </div>
                </div>

                {/* Stripe Settings Group */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -mr-32 -mt-32" />

                    <div className="relative z-10 flex items-center justify-between">
                        <h4 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900 dark:text-white tracking-tight">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            Payment & Billing
                        </h4>
                        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Stripe Active</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-2">Webhook Endpoint</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value="https://passmate.app/api/webhooks"
                                    readOnly
                                    className="w-full pl-11 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-2">Webhook Secret</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={settingsForm.stripe_webhook_secret}
                                    onChange={e => setSettingsForm({ ...settingsForm, stripe_webhook_secret: e.target.value })}
                                    placeholder="whsec_..."
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 ml-2">Standard Product ID</label>
                                <input
                                    type="text"
                                    value={settingsForm.stripe_standard_id}
                                    onChange={e => setSettingsForm({ ...settingsForm, stripe_standard_id: e.target.value })}
                                    placeholder="prod_..."
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 ml-2">Premium Product ID</label>
                                <input
                                    type="text"
                                    value={settingsForm.stripe_premium_id}
                                    onChange={e => setSettingsForm({ ...settingsForm, stripe_premium_id: e.target.value })}
                                    placeholder="prod_..."
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSaveConfig(['stripe_webhook_secret', 'stripe_standard_id', 'stripe_premium_id'])}
                            disabled={loading}
                            className="w-full h-14 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
                        >
                            {loading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Update Billing Keys</>}
                        </Button>
                    </div>
                </div>

                {/* App Configuration Group */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-bl-full -mr-32 -mt-32" />

                    <div className="relative z-10 flex items-center justify-between">
                        <h4 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900 dark:text-white tracking-tight">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600">
                                <Bell className="w-6 h-6" />
                            </div>
                            App Config
                        </h4>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className={`flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${settingsForm.maintenance_mode ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${settingsForm.maintenance_mode ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`font-black text-lg ${settingsForm.maintenance_mode ? 'text-red-900 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>Maintenance Mode</p>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${settingsForm.maintenance_mode ? 'text-red-600/60' : 'text-slate-400'}`}>Admin-Only Restricted Access</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettingsForm({ ...settingsForm, maintenance_mode: !settingsForm.maintenance_mode })}
                                className={`relative inline-flex h-10 w-18 items-center rounded-full transition-all duration-500 border-2 ${settingsForm.maintenance_mode ? 'bg-red-600 border-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}
                            >
                                <span className={`inline-block h-6 w-6 rounded-full bg-white transition-transform duration-500 shadow-md ${settingsForm.maintenance_mode ? 'translate-x-10' : 'translate-x-1.5'}`}></span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Global UI Message (Banner)</label>
                            <input
                                type="text"
                                value={settingsForm.global_banner}
                                onChange={e => setSettingsForm({ ...settingsForm, global_banner: e.target.value })}
                                placeholder="Major update coming this weekend! 🚀"
                                className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary dark:focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800 rounded-[2rem] font-bold outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Daily XP Cap</label>
                                <div className="relative group">
                                    <Trophy className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 transition-transform group-focus-within:scale-110" />
                                    <input
                                        type="number"
                                        value={settingsForm.daily_xp_cap}
                                        onChange={e => setSettingsForm({ ...settingsForm, daily_xp_cap: parseInt(e.target.value) })}
                                        className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary dark:focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800 rounded-[2rem] font-black text-xl outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Hearts Regeneration (Hrs)</label>
                                <div className="relative group">
                                    <RefreshCw className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500 transition-transform group-focus-within:rotate-180 duration-700" />
                                    <input
                                        type="number"
                                        value={settingsForm.heart_regen_hours}
                                        onChange={e => setSettingsForm({ ...settingsForm, heart_regen_hours: parseInt(e.target.value) })}
                                        className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-primary dark:focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800 rounded-[2rem] font-black text-xl outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSaveConfig(['maintenance_mode', 'global_banner', 'daily_xp_cap', 'heart_regen_hours'])}
                            disabled={loading}
                            className="w-full h-20 rounded-[2rem] font-black bg-orange-600 hover:bg-orange-700 text-white shadow-2xl shadow-orange-200 dark:shadow-none hover:scale-[1.02] transition-all"
                        >
                            {loading ? "Processing..." : <><Save className="w-6 h-6 mr-3" /> Commit System Update</>}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
