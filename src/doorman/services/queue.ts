import { text } from "body-parser"


const response1 = {
    "active": false,
    "queued": false,
    "completed": false,
    "progress": null,
    "eta": null,
    "live_preview": null,
    "id_live_preview": -1,
    "textinfo": "Waiting..."
}

const response2 = {
    "active": true,
    "queued": false,
    "completed": false,
    "progress": 0.0,
    "eta": null,
    "live_preview": null,
    "id_live_preview": -1,
    "textinfo": null
}
const response3 = {
    "active": true,
    "queued": false,
    "completed": false,
    "progress": 0.3,
    "eta": 7.1451802253723145,
    "live_preview": null,
    "id_live_preview": -1,
    "textinfo": null
}

const payload2 = {
    "id_task": "task(t6aungz78xma3ua)",
    "id_live_preview": -1
}

const queue = {
    "activeTasks": [],
    "unfoundTasks": [],
}

// let counter = 0 

export function progressResponse(
    completed: boolean,
    progress : number | null,
) {
    // if (progress === undefined) progress = null
    
    let active = true
    if (completed) {
        active = false
    } 
    
    let textinfo = null
    let eta = null
    
    // eta = 12.0 - counter
    
    // progress = progress + (counter * 0.1)

    // if (counter == 0 ) {
    //     textinfo = "Waiting..."
    //     active = false;
    //     completed = false;
    //     progress = null;
    //     eta = null;
    // }

    // if (counter == 1 ) {
    //     progress = 0.00
    //     eta = null
    // }
    // counter ++
    // 1+1
    // console.log(counter, textinfo, progress )
    
    const response = {
        "active": active,
        "queued": false,
        "completed": completed,
        "progress": progress,
        "eta": eta,
        "live_preview": null,
        "id_live_preview": null,
        "textinfo": textinfo
    }
    return response
}

export class Queue {
    private queue: { [key: string]: { startTime: Date, status: string } } = {};
    private notFound: { [key: string]: number } = {};
    private maxNotFound: number = 5;

    // Method to add a task_id to the queue and record its start time
    add(task_id: string): void {
        this.queue[task_id] = { startTime: new Date(), status: "in progress" };
    }

    // Method to check a task_id against its presence and return start time if found
    check(task_id: string): boolean {
        const task = this.queue[task_id];
        if (task) {
            if (task.status === "in progress") {
                return false;
            } else if (task.status === "complete") {
                return true;
            }

        } else {
            // If task_id is not found, add this id to notFound queue and increment its counter
            if (!this.notFound[task_id]) {
                this.notFound[task_id] = 0;
            } else {
                if (this.notFound[task_id] >= this.maxNotFound) {
                    return true
                }
                this.notFound[task_id]++;
                return false;
            }
        }
    }

    // Method to update the task's status to complete
    complete(task_id: string): void {
        if (this.queue[task_id]) {
            this.queue[task_id].status = "complete";
        }
    }
}

interface Payload {
    id_task?: string;
    id_live_preview: number;
}

export function parseTaskId(payload: Payload | string): string | undefined {
    
    let s = ""
    if (typeof payload === "string") {
        s = payload
    } else {
        if (!payload.id_task) {
            console.error('Error: id_task key not found in payload');
            return undefined;
        }
        s = payload.id_task
    }

    const start = s.indexOf("(");
    const end = s.indexOf(")");

    if (start === -1 || end === -1 || start >= end) {
        console.error('Error: could not parse task ID from id_task string');
        return undefined;
    }

    return s.slice(start + 1, end);
}
