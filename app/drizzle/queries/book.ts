import { desc, eq, InferSelectModel } from "drizzle-orm";
import { guestBookTable, usersTable } from "../schema.server";
import { db } from "../db.server";
import { User } from "./users";

export type Book = InferSelectModel<typeof guestBookTable>;
export type GuestBookEntry = Partial<User> & Partial<Book>;

export async function getGuestBookEntriesWithOffset(
	offset: number,
	limit: number = 10
): Promise<GuestBookEntry[]> {
	const guestBook: GuestBookEntry[] = await db
		.select({
			profilePicture: usersTable.profilePicture,
			firstName: usersTable.firstName,
			lastName: usersTable.lastName,
			createdAt: guestBookTable.createdAt,
			message: guestBookTable.message,
		})
		.from(guestBookTable)
		.innerJoin(usersTable, eq(guestBookTable.userId, usersTable.id))
		.offset(offset)
		.limit(limit);

	return guestBook;
}

export async function getGuestBookEntries(): Promise<GuestBookEntry[]> {
	const guestBook: GuestBookEntry[] = await db
		.select({
			profilePicture: usersTable.profilePicture,
			firstName: usersTable.firstName,
			lastName: usersTable.lastName,
			createdAt: guestBookTable.createdAt,
			message: guestBookTable.message,
		})
		.from(guestBookTable)
		.innerJoin(usersTable, eq(guestBookTable.userId, usersTable.id))
		.orderBy(desc(guestBookTable.createdAt));

	return guestBook;
}

export async function createGuestBookEntry(userId: number, message: string) {
	await db.insert(guestBookTable).values({
		userId,
		message,
	});
}
