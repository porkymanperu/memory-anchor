import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Brain } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signIn, signUp } from '@/lib/auth';

type Mode = 'sign-in' | 'sign-up';

export function SignIn() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetPassword = () => setPassword('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    if (mode === 'sign-up' && password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } =
        mode === 'sign-in'
          ? await signIn(trimmedEmail, password)
          : await signUp(trimmedEmail, password);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (mode === 'sign-up') {
        toast.success(
          'Account created. Check your inbox if email confirmation is required.',
        );
        resetPassword();
      } else {
        toast.success('Signed in.');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected authentication error.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Brain size={28} weight="duotone" />
          </div>
          <CardTitle className="text-2xl">Memory Anchor</CardTitle>
          <CardDescription>
            {mode === 'sign-in'
              ? 'Sign in to continue your practice.'
              : 'Create an account to start practicing.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={mode}
            onValueChange={(value) => {
              setMode(value as Mode);
              resetPassword();
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign in</TabsTrigger>
              <TabsTrigger value="sign-up">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="sign-in" className="mt-4">
              <SignInForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Sign in"
              />
            </TabsContent>

            <TabsContent value="sign-up" className="mt-4">
              <SignInForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Create account"
                passwordHint="At least 6 characters."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitLabel: string;
  passwordHint?: string;
}

function SignInForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isSubmitting,
  submitLabel,
  passwordHint,
}: SignInFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isSubmitting}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete={submitLabel === 'Sign in' ? 'current-password' : 'new-password'}
          required
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isSubmitting}
        />
        {passwordHint && (
          <p className="text-xs text-muted-foreground">{passwordHint}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Please wait…' : submitLabel}
      </Button>
    </form>
  );
}
