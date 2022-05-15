export interface IMochawesomeResult {
    uuid: string;
    parentUUID?: string;
    parentTitle?: string;
    file?: string;
    title?: string;
    fullTitle?: string;
    timeOut?: string;
    duration?: number;
    state?: string;
    speed?: string;
    pass?: boolean;
    fail?: boolean;
    pending?: boolean;
    context?: string;
    err?: any;
    isHook?: boolean;
    skipped?: boolean;
}