
export function progressResponse(
    completed: boolean,
    progress : number | null,
) {
    
    let active = true
    if (completed) {
        active = false
    } 
    
    const textinfo = null
    const eta = null
    
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
