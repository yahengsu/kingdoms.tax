package db

import "go.mongodb.org/mongo-driver/bson"

// I dislike aggregation pipelines very much

func addressMatch(address string) bson.D {
	return bson.D{
		{Key: "$match", Value: bson.D{
			{Key: "address", Value: address},
		}},
	}
}

func unwindTxns() bson.D {
	return bson.D{
		{Key: "$unwind", Value: "$txns"},
	}
}

func filterTimestamps(start, end int64) bson.D {
	return bson.D{
		{Key: "$match", Value: bson.D{
			{Key: "txns.timestamp", Value: bson.D{
				{Key: "$gte", Value: start},
				{Key: "$lte", Value: end},
			}},
		}},
	}
}

func sortByTimestamp() bson.D {
	return bson.D{
		{Key: "$sort", Value: bson.D{
			{Key: "txns.timestamp", Value: 1},
		}},
	}
}

func groupTxns() bson.D {
	return bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "txn_res"}, {Key: "txns", Value: bson.D{
				{Key: "$push", Value: "$txns"},
			}},
		}},
	}
}

func countTxns() bson.D {
	return bson.D{
		{Key: "$count", Value: "txn_count"},
	}
}

func appendTxns(txns []Transaction) bson.D {
	return bson.D{
		{Key: "$addToSet", Value: bson.D{
			{Key: "txns", Value: bson.D{
				{Key: "$each", Value: txns},
			}},
		}},
	}
}

func skipTxns(skip int) bson.D {
	return bson.D{
		{Key: "$skip", Value: skip},
	}
}

func limitTxns(limit int) bson.D {
	return bson.D{
		{Key: "$limit", Value: limit},
	}
}
