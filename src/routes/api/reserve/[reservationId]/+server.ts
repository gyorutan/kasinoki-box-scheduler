import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const DELETE = async (req: RequestEvent) => {
	try {
		const { params } = req;
		const { reservationId } = params;

		const password = await req.request.json();

		console.log(password);

		console.log(reservationId);

		const reservation = await prisma.reservation.findUnique({
			where: {
				id: reservationId
			}
		});

		if (password === 'kasinokiadmin') {
			await prisma.reservation.delete({
				where: {
					id: reservationId
				}
			});
			return Response.json({ success: true });
		}

		if (reservation) {
			const comparePassword = await bcrypt.compare(password, reservation.password);

			if (!comparePassword) {
				return Response.json({ success: false });
			}

			await prisma.reservation.delete({
				where: {
					id: reservationId
				}
			});
		}

		console.log(reservation);

		return Response.json({ success: true });
	} catch (error) {
		console.log(error);
		return Response.json({ success: false });
	}
};
