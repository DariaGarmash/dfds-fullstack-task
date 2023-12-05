"use client"

import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from "src/components/ui/input"
import { Button } from 'src/components/ui/button'
import { type TVoyagePayloadCreate } from '~/pages/api/voyage/create'
import { useForm } from 'react-hook-form'
import DateTimePickerSingle from '../ui/datapicker'
import { useQuery } from '@tanstack/react-query'
import { fetchData } from '~/utils'
import { type ReturnType } from '~/pages/api/vessels/getAll'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const postVoyageformSchema = z.object({
    portOfLoading: z.string(),
    portOfDischarge: z.string(),
    vesselId: z.string(),
    scheduledDeparture: z.date(),
    scheduledArrival: z.date()
})

export type TPostVoyageFormData = z.infer<typeof postVoyageformSchema>

interface PostVoaygeFormProps {
    onSubmit(data: TVoyagePayloadCreate): void;
}

const PostVoaygeForm = ({ onSubmit }: PostVoaygeFormProps) => {
    const { data: vessels } = useQuery<ReturnType>(["vessels"], () =>
        fetchData("vessels/getAll")
    );

    const today = new Date()

    const form = useForm<TPostVoyageFormData>({
        resolver: zodResolver(postVoyageformSchema),
        defaultValues: {},
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} required>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a vessel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {vessels?.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
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
                                <Input placeholder="" {...field} required />
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
                                <Input placeholder="" {...field} required />
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
                                <DateTimePickerSingle
                                    {...field}
                                    disabled={{ before: today }}
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
                                <DateTimePickerSingle
                                    {...field}
                                    disabled={{ before: form.getValues().scheduledDeparture }}
                                    required />
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