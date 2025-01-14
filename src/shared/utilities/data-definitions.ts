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


