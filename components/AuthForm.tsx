"use client"

import { z } from "zod"
import React from 'react'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import Link from "next/link"
import { toast } from "sonner"
import CustomFormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"


const authformSchema = (isSignin: boolean) => {
    return z.object({
        name: !isSignin ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
};


function AuthForm({ type }: { type: FormType }) {
    const router = useRouter();
    const isSignIn = type === "sign-in";
    const formSchema = authformSchema(isSignIn);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values)
            if (type === 'sign-up') {
                const { name, email, password } = values;
                console.log(auth)
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                console.log(userCredential.user.uid)
                const result = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email,
                    password,
                });
                if (!result.success) {
                    toast.error(result.message);
                }
                toast.success("sign up successfully lets Sign in");
                router.push('/sign-in');
            } else {
                const { email, password } = values;
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                  );
          
                  const idToken = await userCredential.user.getIdToken();
                  if (!idToken) {
                    toast.error("Sign in Failed. Please try again.");
                    return;
                  }
          
                  await signIn({
                    email,
                    idToken,
                  });
                toast.success("sign in successfully");
                router.push('/');
            }
        }
        catch (error) {
            toast.error(`There was an error: ${error}`);
        }
    }
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3 className="text-primary-100">Practice Job interview with AI</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-6 form">

                        {!isSignIn &&
                            <CustomFormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                                type="text"
                            />
                        }
                        <CustomFormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Enter your Email"
                            type="email"
                        />

                        <CustomFormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />


                        <Button className="btn" type="submit">{isSignIn ? "Sign in " : "Create Account"}</Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm

