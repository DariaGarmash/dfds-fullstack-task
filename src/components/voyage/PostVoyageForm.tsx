"use client"

import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from "src/components/ui/input"
import { Button } from 'src/components/ui/button'
import { type TVoyagePayloadCreate } from '~/pages/api/voyage/create'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { fetchData } from '~/utils'
import { type ReturnTypeVessel } from '~/pages/api/vessels/getAll'
import { type ReturnTypeUnitTypes } from '~/pages/api/unitTypes/getAll'
import { Checkbox } from '../ui/checkbox'
import DatePickerSingle from '../ui/datapicker'
import SelectAsync from '../ui/selectAsync'

const generateErrorMessage = (fieldName: string) => `Please provide ${fieldName}.`

const postVoyageformSchema = z.object({
    portOfLoading: z.string().min(2, {
        message: generateErrorMessage('port of discharge')
    }),
    portOfDischarge: z.string().min(2, {
        message: generateErrorMessage('port of discharge')
    }),
    vesselId: z.string().min(2, {
        message: generateErrorMessage('vessel')
    }),
    scheduledDeparture: z.date({
        required_error: generateErrorMessage('departure date')
    }),
    scheduledArrival: z.date({
        required_error: generateErrorMessage('arrival date')
    }),
    unitTypes: z.string().array().min(5, {
        message: "Please selected at least 5 unit types",
    })
}).superRefine((values, context) => {
    if (values.portOfLoading === values.portOfDischarge) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Port of loading should be different form port of discharge',
            path: ['portOfLoading']
        })
    }
})

export type TPostVoyageFormData = z.infer<typeof postVoyageformSchema>

interface PostVoaygeFormProps {
    onSubmit(data: TVoyagePayloadCreate): void;
}

const PostVoaygeForm = ({ onSubmit }: PostVoaygeFormProps) => {


    const { data: unitTypes } = useQuery<ReturnTypeUnitTypes>(["unitTypes"], () =>
        fetchData("unitTypes/getAll")
    );

    const today = new Date()

    const form = useForm<TPostVoyageFormData>({
        resolver: zodResolver(postVoyageformSchema),
        defaultValues: {
            portOfLoading: '',
            portOfDischarge: '',
            vesselId: '',
            unitTypes: []
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={(event) => {
                event.preventDefault()
                void form.handleSubmit(onSubmit)(event)
            }} className="space-y-8">
                <FormField
                    control={form.control}
                    name="vesselId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vessel</FormLabel>
                            <FormControl>
                                <SelectAsync onValueChange={field.onChange} defaultValue={field.value}
                                    placeholder='Select a vessel'
                                    pathToFetchOptions='vessels/getAll' queryKey={["vessels"]} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="portOfLoading"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Port of loading</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="portOfDischarge"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Port of discharge</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="scheduledDeparture"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departure</FormLabel>
                            <FormControl>
                                <DatePickerSingle
                                    {...field}
                                    disabled={{ before: form.getValues().scheduledArrival ?? today }}
                                    required />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="scheduledArrival"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Arrival</FormLabel>
                            <FormControl>
                                <DatePickerSingle
                                    {...field}
                                    disabled={{ before: form.getValues().scheduledDeparture ?? today }}
                                    required />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="unitTypes"
                    render={(allUnitTypes) => (
                        <FormItem>
                            <FormLabel>Unit types</FormLabel>
                            <FormControl>
                                <>
                                    {unitTypes?.map((unitType) => (
                                        < FormField key={unitType.id}
                                            control={form.control}
                                            name="unitTypes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <>
                                                            <Checkbox className='mr-2'
                                                                {...field}
                                                                value={unitType.id}
                                                                checked={allUnitTypes.field.value?.includes(unitType.id)}
                                                                onCheckedChange={checked => {
                                                                    checked ?
                                                                        field.onChange([...allUnitTypes.field.value, unitType.id]) :
                                                                        field.onChange(allUnitTypes.field.value.filter(v => v !== unitType.id))
                                                                }}
                                                            />
                                                            <FormLabel>{unitType.name}</FormLabel>
                                                        </>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default PostVoaygeForm