'use server';

import { adminLogin, customerLogin, forgotPassword, setPassword } from "../services/auth-service";
import { createBank, createCorporateCustomer, createIndividualCustomer, createUserClerk } from "../services/main-service";
import { showToast } from "./commons";
import { BankSchema, CorporateCustomerSchema, IndividualCustomerSchema, UserSchema } from "./data-definitions";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const CreateUser = UserSchema.omit({id: true});
const CreateBank = BankSchema.omit({id: true});
const CreateIndividual = IndividualCustomerSchema.omit({id: true});
const CreateCorporate = CorporateCustomerSchema.omit({id: true});

export async function createUserUtil(formData: FormData){

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
        
        showToast('Fill in all required fields.', 'info');
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    try {
        await createUserClerk(validatedFields.data);    
    } catch (err) {
        console.log(err);
        showToast('Failed to create User.', 'error');
        return {
            errors: err,
            message: 'Server Side Error. Failed to Create User.',
        };
    }

    // console.log(resp);    

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');

}

export async function createBankUtil(formData: FormData){
    const validatedFields = CreateBank.safeParse({
        bankName: formData?.get('name'),
        bin: formData?.get('bin'),
        swiftCode: formData?.get('swiftCode')
    });
    // console.log(validatedFields);
    

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Bank.',
        };
    }

    try {
        await createBank(validatedFields.data);    
    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to Create Bank.',
        };
    }

    // console.log(resp);    

    revalidatePath('/dashboard/banks');
    redirect('/dashboard/banks');

}

export async function loginAuthUtil(uname: string, upwd: string, utyp: string){

    const formData = {
        'username': uname,
        'password': upwd
    };

    try {
        return (utyp == 'customer') ? await customerLogin(formData) : await adminLogin(formData);    

    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to Login.',
        };
    }

}

export async function forgotPwdUtil(uname: string){

    const formData = {
        'username': uname
    };

    try {
        return await forgotPassword(formData);    

    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to request Password Reset.',
        };
    }

}

export async function setPwdUtil(token: string, pass1: string, pass2: string){

    const formData = {
        'token': token,
        "password": pass1,
        "confirmPassword": pass2
    };

    try {
        return await setPassword(formData);    

    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to request Password Reset.',
        };
    }

}

export async function createIndividualCustomerUtil(formData: FormData){
    
    const validatedFields = CreateIndividual.safeParse({
        customerName: formData?.get('name'),
        email: formData?.get('email'),
        address: formData?.get('address'),
        phoneNumber: formData?.get('phone'),
        nationalId: formData?.get('nationalId'),
        numberOfRequiredApproversPerTransaction: formData?.get('reqApprovers'),
        username: formData?.get('username'),
        password: formData?.get('password'),
        accounts: formData?.get('accounts')
    });
    // console.log(validatedFields);
    

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Individual Customer.',
        };
    }

    try {
        await createIndividualCustomer(validatedFields.data);    
    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to Create Customer.',
        };
    }

    // console.log(resp);    

    revalidatePath('/dashboard/customers/individual');
    redirect('/dashboard/customers/individual');

}

export async function createCorporateCustomerUtil(formData: FormData){
    const validatedFields = CreateCorporate.safeParse({
        companyName: formData?.get('name'),
        email: formData?.get('email'),
        address: formData?.get('address'),
        telephoneNumber: formData?.get('phone'),
        registrationNumber: formData?.get('regNumber'),
        numberOfRequiredApproversPerTransaction: formData?.get('reqApprovers'),
        incorporationDate: formData?.get('incoDate'),
        userRights: formData?.get('users'),
        accounts: formData?.get('accounts')
    });
    // console.log(validatedFields);
    

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Corporate Customer.',
        };
    }

    try {
        await createCorporateCustomer(validatedFields.data);    
    } catch (err) {
        console.log(err);
        return {
            errors: err,
            message: 'Server Side Error. Failed to Create Customer.',
        };
    }

    // console.log(resp);    

    revalidatePath('/dashboard/customers/corporate');
    redirect('/dashboard/customers/corporate');

}


