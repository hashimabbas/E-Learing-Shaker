import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const { translations } = usePage<SharedData & { translations: any }>().props;

    return (
        <AuthLayout
            title={translations.auth_login_title || "Log in to your account"}
            description={translations.auth_login_description || "Enter your email and password below to log in"}
        >
            <Head title={translations.auth_login_head || "Log in"} />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold tracking-wide ml-1 rtl:mr-1">{translations.auth_email || "Email address"}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={translations.auth_email_placeholder || "email@example.com"}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold tracking-wide ml-1 rtl:mr-1">{translations.auth_password || "Password"}</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                            tabIndex={5}
                                        >
                                            {translations.auth_forgot_password || "Forgot password?"}
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={translations.auth_password || "Password"}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="h-5 w-5 rounded-md border-slate-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">{translations.auth_remember_me || "Remember me"}</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-12 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-600 to-amber-700 text-base font-bold text-black border-none shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-100"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                                {translations.auth_login_btn || "Log in"}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                                {translations.auth_no_account || "Don't have an account?"}{' '}
                                <TextLink href={register()} className="font-bold text-primary hover:underline" tabIndex={5}>
                                    {translations.auth_signup || "Sign up"}
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
