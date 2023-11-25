import { prisma } from '$lib/server/prisma';
import { weekDayTimes, weekEndTimes } from '$lib/timeData';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (req: RequestEvent) => {
	try {
		const formattedDate = await req.request.json();

		const checkedDate = await prisma.reservation.findMany({
			where: {
				date: {
					equals: formattedDate
				}
			}
		});

		type ReservedTimes = {
			time: string[];
		};

		const reservedTimes: ReservedTimes = {
			time: []
		};

		checkedDate.forEach((item) => {
			reservedTimes.time.push(item.time);
		});

		// 예약된 시간
		const reservedTime = reservedTimes.time;

		// 평일 예약된 시간 제외
		const availableWeekDayTimes = weekDayTimes.filter(
			(time: string) => !reservedTime.includes(time)
		);

		// 주말 예약된 시간 제외
		const availableWeekEndTimes = weekEndTimes.filter(
			(time: string) => !reservedTime.includes(time)
		);

		const availableTimes = { availableWeekDayTimes, availableWeekEndTimes };

		return Response.json({ success: true, availableTimes });
	} catch (error) {
		console.log(error);
		return Response.json({ success: false });
	}
};
