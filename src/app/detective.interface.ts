export interface conversation{
    role : 'user' | 'assistant'
    content : string
}

export interface caseDetails{
    title : string,
    description : string,
    suspects : Array<suspect>,
    cluePool : Array<string>,
    lastSummaryCount : Number,
    summary : string
}

export interface suspect{
    _id : string,
    name : string,
    role : string
}