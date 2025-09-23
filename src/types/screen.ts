export interface ScreenResponse {
  id: number; //

}

export interface SchedulesForAuditorium {
    id: number;
    movie_id: number;
    auditorium_id: number;
    start_time: string;
    end_time: string;
}
