// This file contains type validations

import { z } from 'zod';

export const UserSchema = z.object({
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

export const BankSchema = z.object({
    id: z.string(),
    bankName: z.string({
        invalid_type_error: 'Please enter a name.',
    }),
    bin: z.string({
        invalid_type_error: 'Please enter a bin.',
    }),
    swiftCode: z.string({
        invalid_type_error: 'Please enter swift code.',
    }),
});

export const IndividualCustomerSchema = z.object({
    id: z.string(),
    customerName: z.string({
        invalid_type_error: 'Please enter a name.',
    }),
    email: z.string({
        invalid_type_error: 'Please enter an email.',
    }),
    address: z.string({
        invalid_type_error: 'Please enter address.',
    }),
    phoneNumber: z.string({
        invalid_type_error: 'Please enter phone.',
    }),
    nationalId: z.string({
        invalid_type_error: 'Please enter national id.',
    }),
    numberOfRequiredApproversPerTransaction: z.number({
        invalid_type_error: 'Please enter number.',
    }),
    // username: z.string({
    //     invalid_type_error: 'Please enter a username.',
    // }),
    // password: z.string({
    //     invalid_type_error: 'Please enter a password.',
    // }),
    accounts: z.array(z.object({
        accountName: z.string({
            invalid_type_error: 'Please enter an account name.',
        }),
        accountNumber: z.string({
            invalid_type_error: 'Please enter an account number.',
        }),
        accountType: z.string({
            invalid_type_error: 'Please select account type.',
        }),
    }))
});

export const CorporateCustomerSchema = z.object({
    id: z.string(),
    companyName: z.string({
        invalid_type_error: 'Please enter a name.',
    }),
    email: z.string({
        invalid_type_error: 'Please enter an email.',
    }),
    address: z.string({
        invalid_type_error: 'Please enter an address.',
    }),
    registrationNumber: z.string({
        invalid_type_error: 'Please enter registration number.',
    }),
    telephoneNumber: z.string({
        invalid_type_error: 'Please enter phone.',
    }),
    incorporationDate: z.date({
        invalid_type_error: 'Please select date.',
    }),
    numberOfRequiredApproversPerTransaction: z.number({
        invalid_type_error: 'Please enter number.',
    }),
    accounts: z.array(z.object({
        accountName: z.string({
            invalid_type_error: 'Please enter an account name.',
        }),
        accountNumber: z.string({
            invalid_type_error: 'Please enter an account number.',
        }),
        accountType: z.string({
            invalid_type_error: 'Please select account type.',
        }),
    })),
    userRights: z.array(z.object({
        name: z.string({
            invalid_type_error: 'Please enter a name.',
        }),
        email: z.string({
            invalid_type_error: 'Please enter an email.',
        }),
        userRight: z.string({
            invalid_type_error: 'Please select select right.',
        }),
        nationalId: z.string({
            invalid_type_error: 'Please enter national id.',
        }),
        phoneNumber: z.string({
            invalid_type_error: 'Please enter phone.',
        }),
    }))
});



