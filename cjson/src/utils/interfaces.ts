export interface DirectoryContent {
    url: string,
    isDirectory: boolean,
    filename: string
}

export interface BackTrackSearchResult {
    strSet: string | null,
    result: boolean
}