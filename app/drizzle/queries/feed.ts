import { InferSelectModel, eq } from "drizzle-orm";
import { feedTable, usersTable } from "../schema.server";
import { User } from "./users";
import { db } from "../db.server";

export type Feed = InferSelectModel<typeof feedTable>;
export type FeedPost = Partial<User> & Partial<Feed>;

export async function getFeedPostsWithOffset(
	offset: number,
	limit: number = 10
) {
	const feedPosts = await db
		.select({
			profilePicture: usersTable.profilePicture,
			firstName: usersTable.firstName,
			createdAt: feedTable.createdAt,
			message: feedTable.message,
		})
		.from(feedTable)
		.leftJoin(usersTable, eq(feedTable.userId, usersTable.id))
		.offset(offset)
		.limit(limit);

	return feedPosts;
}

export async function getFeedPosts() {
	const feedPosts = await db
		.select({
			profilePicture: usersTable.profilePicture,
			firstName: usersTable.firstName,
			createdAt: feedTable.createdAt,
			message: feedTable.message,
		})
		.from(feedTable)
		.leftJoin(usersTable, eq(feedTable.userId, usersTable.id));

	return feedPosts;
}

export async function createFeedPost(userId: number, message: string) {
	await db.insert(feedTable).values({
		userId,
		message,
	});
}