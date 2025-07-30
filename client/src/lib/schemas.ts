import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email({ message: 'A valid email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
 confirmPassword:z.string().min(6,{message:"password should be atleast 6 characters"})
}).refine((data)=>(
    data.confirmPassword==data.password,{
        message:"password did not match",
        path:['confirmPassword']
    }
))

export type SignupFormValues = z.infer<typeof signupSchema>;


export const signinSchema = z.object({
    email:z.string().email({message:"Enterr a valid email"}),
    password:z.string().min(6,{message:"password should be atleast 6 characters"}),
}
)


export type signInValues = z.infer<typeof signinSchema>