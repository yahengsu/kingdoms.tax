package db

import "go.mongodb.org/mongo-driver/bson"

// I dislike aggregation pipelines very much

// Generates match filters
func genAddressMatch(address string) bson.D {
	return bson.D{
		{Key: "$match", Value: bson.D{
			{Key: "address", Value: address},
		}},
	}
}
func genTimeFilter(start, end int64) bson.D {
	return bson.D{
		{Key: "$match", Value: bson.D{
			{Key: "txns.timestamp", Value: bson.D{
				{Key: "$gte", Value: start},
				{Key: "$lte", Value: end},
			}},
		}},
	}
}
func genGroupFilter() bson.D {
	return bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "txn_res"}, {Key: "txns", Value: bson.D{
				{Key: "$push", Value: "$txns"},
			}},
		}},
	}
}
func genUnwind() bson.D {
	return bson.D{
		{Key: "$unwind", Value: "$txns"},
	}
}
