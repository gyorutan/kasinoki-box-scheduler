import { prisma } from '$lib/server/prisma';
import { weekDayTimes, weekEndTimes } from '$lib/timeData';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (req: RequestEvent) => {
	try {
		const formattedDate = await req.request.json();

		console.log('BE 선택된 날짜 :' ,formattedDate);

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

		console.log('BE 평일 예약 가능 시간 :', availableWeekDayTimes);

		// 주말 예약된 시간 제외
		const availableWeekEndTimes = weekEndTimes.filter(
			(time: string) => !reservedTime.includes(time)
		);

		console.log('BE 주말 예약 가능 시간 :', availableWeekEndTimes);

		const availableTimes = { availableWeekDayTimes, availableWeekEndTimes };

		console.log('BE 종합 예약 가능 시간 :', availableTimes);

		return Response.json({ success: true, availableTimes });
	} catch (error) {
		console.log(error);
		return Response.json({ success: false });
	}
};
