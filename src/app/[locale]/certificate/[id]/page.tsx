import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Award, Star, Shield, Calendar, Download, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function CertificatePage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: attempt } = await supabase
        .from("quiz_attempts")
        .select(`
            *,
            profiles (
                username,
                full_name,
                avatar_url,
                premium_tier
            )
        `)
        .eq("id", params.id)
        .single();

    if (!attempt || attempt.user_id !== user.id) {
        notFound();
    }

    // Verify it was a pass (usually mock tests are 20 questions, 75% is 15)
    const isMockTest = attempt.total_questions === 20;
    const hasPassed = attempt.score >= (attempt.total_questions * 0.75);

    if (!hasPassed) {
        redirect("/dashboard?error=not_passed");
    }

    const completedDate = new Date(attempt.completed_at).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8 flex flex-col items-center">
            {/* Controls */}
            <div className="max-w-[800px] w-full mb-8 flex items-center justify-between no-print">
                <Link href="/dashboard">
                    <Button variant="outline" className="gap-2">
                        < Award className="w-4 h-4" /> Back to App
                    </Button>
                </Link>
                <div className="flex gap-3">
                    <Button variant="secondary" className="gap-2 no-print" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Print
                    </Button>
                    <Button className="gap-2">
                        <Download className="w-4 h-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Certificate Canvas */}
            <div className="bg-white max-w-[800px] w-full aspect-[1/1.414] shadow-2xl rounded-[1rem] border-[16px] border-double border-primary/20 p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden certificate-glow">
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                {/* Corner Accents */}
                <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-primary/30 rounded-tl-3xl" />
                <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-primary/30 rounded-tr-3xl" />
                <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-accent/30 rounded-bl-3xl" />
                <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-accent/30 rounded-br-3xl" />

                <div className="mb-12 flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white text-5xl mb-6 shadow-xl relative shadow-primary/30">
                        🇦🇺
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-yellow-900 font-black">
                            PRO
                        </div>
                    </div>
                    <h2 className="text-xl font-display font-black tracking-[0.3em] text-primary uppercase mb-2">PassMate Australia</h2>
                    <div className="h-1 w-24 bg-primary/20 rounded-full" />
                </div>

                <h1 className="text-5xl md:text-6xl font-display font-black text-foreground mb-4 tracking-tighter">
                    CERTIFICATE <br /> <span className="text-primary text-4xl">OF MASTERY</span>
                </h1>

                <p className="text-muted-foreground font-bold italic text-lg mb-12">
                    This official certificate is proudly presented to
                </p>

                <div className="mb-12">
                    <h3 className="text-4xl md:text-5xl font-display font-black text-foreground underline underline-offset-8 decoration-primary/30 decoration-8">
                        {attempt.profiles?.full_name || attempt.profiles?.username || "Citizen Mate"}
                    </h3>
                </div>

                <div className="max-w-md mb-16 space-y-6">
                    <p className="text-lg font-medium leading-relaxed">
                        For successfully completing the <span className="font-black text-primary">Advanced Australian Citizenship Mock Test</span> with an exceptional score of <span className="font-black text-primary">{Math.round((attempt.score / attempt.total_questions) * 100)}%</span>.
                    </p>
                    <p className="text-muted-foreground font-bold text-sm">
                        This achievement demonstrates comprehensive knowledge of Australian values, history, and democratic systems.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-20 w-full mt-auto">
                    <div className="flex flex-col items-center">
                        <div className="font-display font-black text-2xl text-foreground mb-1">{completedDate}</div>
                        <div className="h-0.5 w-full bg-border mb-2" />
                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                            <Calendar className="w-3 h-3" /> Date Completed
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-primary/80 italic font-bold text-xl mb-1 flex items-center gap-2">
                            Ollie Koala
                        </div>
                        <div className="h-0.5 w-full bg-border mb-2" />
                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                            <Star className="w-3 h-3" /> Official Mascot
                        </div>
                    </div>
                </div>

                {/* Seal */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400 rounded-full border-8 border-white shadow-2xl flex flex-col items-center justify-center opacity-90 rotate-12 scale-110">
                    < Shield className="w-8 h-8 text-yellow-900 mb-1" />
                    <span className="text-[10px] font-black text-yellow-900 uppercase">Verified</span>
                    <span className="text-[8px] font-black text-yellow-900/70 tracking-tighter">ID: {params.id.slice(0, 8).toUpperCase()}</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .certificate-glow { box-shadow: none !important; border-radius: 0 !important; }
                }
                .certificate-glow {
                   box-shadow: 0 0 100px -20px rgba(27,155,143,0.15);
                }
            `}} />
        </div>
    );
}
