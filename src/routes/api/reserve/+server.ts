import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const GET = async () => {
	try {
		const reservations = await prisma.reservation.findMany({
			orderBy: {
				time: 'asc'
			}
		});

		return Response.json({ success: true, reservations });
	} catch (error) {
		console.log(error);
		return Response.json({ success: false });
	}
};

export const POST = async (req: RequestEvent) => {
	try {
		const { name, password, selectedDate, selectedTime } = await req.request.json();

		const hashedPassword = await bcrypt.hash(password, 12);

		const creadtedReservation = await prisma.reservation.create({
			data: {
				name,
				password: hashedPassword,
				date: selectedDate,
				time: selectedTime
			}
		});
		return Response.json({ success: true, creadtedReservation });
	} catch (error) {
		console.log(error);
		return Response.json({ success: false });
	}
};
