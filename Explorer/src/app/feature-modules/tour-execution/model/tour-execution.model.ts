import { CompletedKeyPoint } from "./completed-key-point.model";

export interface TourExecution {
	id: number;
	tourId: number;
	keyPointProgresses: CompletedKeyPoint[]
}
