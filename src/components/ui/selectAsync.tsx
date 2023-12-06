import { Select, SelectContent, SelectItem, type SelectProps, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import React from 'react'
import { FormControl } from './form'
import { fetchData } from '~/utils'
import { type QueryKey, useQuery } from '@tanstack/react-query'

interface Option {
    id: string;
    name: string;
}

interface SelectAsyncProps extends Omit<SelectProps, 'className'> {
    placeholder: string,
    queryKey: QueryKey,
    pathToFetchOptions: string
}

const SelectAsync = <T extends Option>(
    { onValueChange, defaultValue, placeholder, queryKey, pathToFetchOptions, ...props }: SelectAsyncProps) => {

    const { data: options, isLoading } = useQuery<T[]>(queryKey, () =>
        fetchData(pathToFetchOptions)
    );

    if (isLoading) {
        return <p>Loading options ...</p>
    }

    return (
        <Select onValueChange={onValueChange} defaultValue={defaultValue} {...props}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options?.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>)}
            </SelectContent>
        </Select>
    )
}



export default SelectAsync
