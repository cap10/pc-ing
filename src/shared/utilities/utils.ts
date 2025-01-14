'use server';

import { createClerkUser } from "../repositories/main-repository";
import { UserSchema } from "./data-definitions";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const CreateUser = UserSchema.omit({id: true});

export async function createUser(formData: FormData){

    const validatedFields = CreateUser.safeParse({
        username: formData?.get('username'),
        name: formData?.get('name'),
        email: formData?.get('email'),
        phoneNumber: formData?.get('phone'),
        nationalId: formData?.get('national'),
        groupId: formData?.get('role'),
    });
    // console.log(validatedFields);
    

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    try {
        await createClerkUser(validatedFields.data);    
    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to Create User.',
        };
    }

    // console.log(resp);    

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');

}