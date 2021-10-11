export type MovieResponse = {
    data: Movie[],
    error?: string,
    message? :string
}

export type Movie = {
    _id?: string,
    name: string,
    time: string[],
    rating: number
}
