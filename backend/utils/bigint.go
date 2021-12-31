package utils

import (
	"fmt"
	"math/big"
	"strconv"
)

type BigInt struct {
	big.Int
}

func (b BigInt) MarshalJSON() ([]byte, error) {
	return []byte(b.String()), nil
}

func (b BigInt) MarshalBSON() ([]byte, error) {
	return b.MarshalJSON()
}

func (b *BigInt) UnmarshalJSON(data []byte) error {
	var dataString string
	dataString, err := strconv.Unquote(string(data))
	if err != nil {
		dataString = string(data)
	}

	if dataString == "null" {
		return nil
	}

	var z big.Int
	_, ok := z.SetString(dataString, 0)
	if !ok {
		return fmt.Errorf("not a valid big integer: %s", dataString)
	}
	b.Int = z

	return nil
}

func (b *BigInt) UnmarshalBSON(data []byte) error {
	return b.UnmarshalJSON(data)
}
