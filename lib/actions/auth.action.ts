'use server';

import {auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function signUp(params:SignUpParams) {
    
    const {email,name,password,uid}=params;

    try
    {
        const userRecord=await db.collection("users").doc(uid).get();

        if(userRecord.exists)
        {
            return {
                success:false,
                message:"User already exists"
            }
        }
        await db.collection("users").doc(uid).set({
            email,
            name
        });
        return {
            success: true,
            message: "Account created successfully. Please sign in.",
          };

    }catch(e:any)
    {
        console.log("error accoure while Signup",e);

        if(e.code === 'auth/email-already-in-use')
        {
            return {
                error:true,
                message:"Email already in use"
            }
        }else if(e.code === 'auth/invalid-email')
        {
            return {
                error:true,
                message:"Invalid email"
            }
        }else if(e.code === 'auth/weak-password')  
        {
            return {
                error:true,
                message:"Weak password"
            }
        }else if(e.code === 'auth/operation-not-allowed')
        {
            return {
                error:true,
                message:"Operation not allowed"
            }
        }else if(e.code === 'auth/too-many-requests')
        {
            return {
                error:true,
                message:"Too many requests"
            } 
        
        }

        return {
            error:true,
            message:"Something went wrong while signing up"
        }


    }
}



// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
  
    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000, // milliseconds
    });
  
    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  }


  
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
  
    try {
      const userRecord = await auth.getUserByEmail(email);
      if (!userRecord)
        return {
          success: false,
          message: "User does not exist. Create an account.",
        };
  
      await setSessionCookie(idToken);
    } catch (error: any) {
      console.log("");
  
      return {
        success: false,
        message: "Failed to log into account. Please try again.",
      };
    }
  }
  
  // Sign out user by clearing the session cookie
  export async function signOut() {
    const cookieStore = await cookies();
  
    cookieStore.delete("session");
  }
  
  // Get current user from session cookie
  export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      // get user info from db
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
  }
  
  // Check if user is authenticated
  export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
  }
  