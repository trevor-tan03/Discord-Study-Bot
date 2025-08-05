import { db } from "../database/database.js";

export async function listTags() {
	const tags = await db.selectFrom("tags").select("tags.name").execute();
	return tags;
}
