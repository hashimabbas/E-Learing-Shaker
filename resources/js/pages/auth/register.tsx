import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { type SharedData } from '@/types';

export default function Register() {
    const { translations } = usePage<SharedData & { translations: any }>().props;

    return (
        <AuthLayout
            title={translations.auth_register_title || "Create an account"}
            description={translations.auth_register_description || "Enter your details below to create your account"}
        >
            <Head title={translations.auth_register_head || "Register"} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold tracking-wide ml-1 rtl:mr-1">{translations.auth_name || "Name"}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={translations.auth_name_placeholder || "Full name"}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold tracking-wide ml-1 rtl:mr-1">{translations.auth_email || "Email address"}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={translations.auth_email_placeholder || "email@example.com"}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold tracking-wide ml-1 rtl:mr-1">{translations.auth_password || "Password"}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={translations.auth_password || "Password"}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold tracking-wide ml-1 rtl:mr-1">
                                    {translations.auth_confirm_password || "Confirm password"}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={translations.auth_confirm_password || "Confirm password"}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-600 to-amber-700 text-base font-bold text-black border-none shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-100"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                                {translations.auth_register_btn || "Create account"}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                            {translations.auth_already_have_account || "Already have an account?"}{' '}
                            <TextLink href={login()} className="font-bold text-primary hover:underline" tabIndex={6}>
                                {translations.auth_login_btn || "Log in"}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
