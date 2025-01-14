'use server';

// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
import { z } from 'zod';

const UserSchema = z.object({
    id: z.string(),
    username: z.string({
        invalid_type_error: 'Please enter a username.',
    }),
    name: z.string({
        invalid_type_error: 'Please enter a name.',
    }),
    email: z.string({
        invalid_type_error: 'Please enter an email.',
    }),
    phoneNumber: z.string({
        invalid_type_error: 'Please enter a phone number.',
    }),
    nationalId: z.string({
        invalid_type_error: 'Please enter a nationali ID.',
    }),
    groupId: z.string({
        invalid_type_error: 'Please select a role.',
    }),
});

const CreateUser = UserSchema.omit({id: true});

export async function createUser(formData: FormData){

    // const rawFormData = {
    //     customerId: formData.get('customerId'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status'),
    // };
    // const rawFormData = Object.fromEntries(formData.entries())

    // console.log(rawFormData);

    const validatedFields = CreateUser.safeParse({
        username: formData.get('username'),
        name: formData.get('name'),
        email: formData.get('email'),
        phoneNumber: formData.get('phone'),
        nationalId: formData.get('national'),
        groupId: formData.get('role'),
    });
    // console.log(validatedFields);
    

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    console.log(validatedFields.data);
    

    // revalidatePath('/dashboard/users');
    // redirect('/dashboard/users');

}