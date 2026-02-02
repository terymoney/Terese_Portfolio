import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const refresh = async () => {
    console.log("AuthGate.refresh() start");
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.warn("getSession error:", error);
      setSessionEmail(data.session?.user?.email ?? null);
    } catch (e) {
      console.error("getSession threw:", e);
      setSessionEmail(null);
    } finally {
      console.log("AuthGate.refresh() end -> loading=false");
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // hard timeout so you NEVER stay stuck on loading
    const t = setTimeout(() => {
      if (!mounted) return;
      console.warn("AuthGate timeout forcing loading=false");
      setLoading(false);
    }, 1500);

    refresh();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth change:", _event, session?.user?.email);
      refresh();
    });

    return () => {
      mounted = false;
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async () => {
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Enter email + password." });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Login failed", description: error.message });
  };

  const signUp = async () => {
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Enter email + password." });
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast({ title: "Signup failed", description: error.message });
      return;
    }
    toast({
      title: "Account created ✅",
      description: "Check your email to confirm (if confirm email is enabled), then sign in.",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  if (!sessionEmail) {
    return (
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Login to create invoices</h3>
          <p className="text-sm text-muted-foreground">
            Clients never log in — only you (the receiver) do.
          </p>
        </div>

        <div className="grid gap-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={signIn} className="flex-1">
              Sign in
            </Button>
            <Button onClick={signUp} variant="outline" className="flex-1">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Logged in as <span className="text-foreground font-medium">{sessionEmail}</span>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>
      {children}
    </div>
  );
}
