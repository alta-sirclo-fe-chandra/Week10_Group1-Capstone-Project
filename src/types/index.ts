export interface schedule {
    id: number,
    total_capacity: number,
    capacity: number,
    office: number,
    time: string,
}

export interface currentSchedule {
    id?: number,
    date?: string,
    total_capacity?: number,
    capacity?: number,
    office?: string,
    total_page?: number,
}

export interface user {
    id: number,
    name: string,
    email: string,
    image_url: string,
    nik: string,
    vaccine_status: string,
    office: string
}

export interface office {
    id?: number,
    name?: string,
    description?: string
}

export interface attendance {
    id?: number,
    schedule_id?: number,
    actual_capacity?: number,
    date?: string,
    office?: string,
    image_url?: string,
    description?: string,
    request_time?: string,
    user?: user
}