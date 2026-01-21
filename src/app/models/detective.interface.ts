export interface conversation{
    _id : string
    role : 'user' | 'assistant'
    content : string
}

export interface caseDetails{
    _id : string
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