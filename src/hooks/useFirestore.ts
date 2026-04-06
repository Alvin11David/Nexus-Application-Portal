import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
	type OrderByDirection,
	type QueryConstraint,
	type WhereFilterOp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/integrations/firebase/config";

type WhereClause = {
	field: string;
	operator: WhereFilterOp;
	value: unknown;
};

type CollectionOptions = {
	orderBy?: {
		field: string;
		direction?: OrderByDirection;
	};
	where?: WhereClause;
	limit?: number;
};

type FirestoreCollectionResult<T> = {
	data: T[];
	isLoading: boolean;
	error: Error | null;
	isUsingFallback: boolean;
};

const normalizeField = (value: unknown): unknown => {
	if (!value || typeof value !== "object") return value;

	const maybeTimestamp = value as {
		toDate?: () => Date;
		seconds?: number;
		nanoseconds?: number;
	};

	if (typeof maybeTimestamp.toDate === "function") {
		return maybeTimestamp.toDate().toISOString();
	}

	if (typeof maybeTimestamp.seconds === "number") {
		return new Date(maybeTimestamp.seconds * 1000).toISOString();
	}

	return value;
};

const normalizeDoc = <T extends Record<string, unknown>>(
	raw: Record<string, unknown>,
	id: string,
): T => {
	const normalized = Object.entries(raw).reduce<Record<string, unknown>>(
		(acc, [key, value]) => {
			acc[key] = normalizeField(value);
			return acc;
		},
		{ id },
	);

	return normalized as T;
};

export const useFirestoreCollection = <T extends Record<string, unknown>>(
	collectionName: string,
	fallbackData: T[] = [],
	options?: CollectionOptions,
): FirestoreCollectionResult<T> => {
	const queryKey = useMemo(
		() => ["firestore", collectionName, options],
		[collectionName, options],
	);

	const firestoreQuery = useQuery<T[], Error>({
		queryKey,
		enabled: isFirebaseConfigured && Boolean(db),
		queryFn: async () => {
			if (!db) {
				return [];
			}

			const constraints: QueryConstraint[] = [];

			if (options?.where) {
				constraints.push(
					where(options.where.field, options.where.operator, options.where.value),
				);
			}

			if (options?.orderBy) {
				constraints.push(
					orderBy(options.orderBy.field, options.orderBy.direction ?? "asc"),
				);
			}

			if (typeof options?.limit === "number") {
				constraints.push(limit(options.limit));
			}

			const ref = collection(db, collectionName);
			const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
			const snapshot = await getDocs(q);

			return snapshot.docs.map((doc) =>
				normalizeDoc<T>(doc.data() as Record<string, unknown>, doc.id),
			);
		},
	});

	const hasRemoteData = Boolean(firestoreQuery.data?.length);
	const isUsingFallback = !isFirebaseConfigured || !hasRemoteData;

	return {
		data: hasRemoteData ? firestoreQuery.data ?? [] : fallbackData,
		isLoading: firestoreQuery.isLoading,
		error: firestoreQuery.error,
		isUsingFallback,
	};
};

