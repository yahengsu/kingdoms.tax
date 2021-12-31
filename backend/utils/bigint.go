package utils

import (
	"fmt"
	"math/big"
)

type BigInt struct {
	big.Int
}

func (b BigInt) MarshalJSON() ([]byte, error) {
	return []byte(b.String()), nil
}

func (b *BigInt) UnmarshalJson(data []byte) error {
	if string(data) == "null" {
		return nil
	}

	var z big.Int
	_, ok := z.SetString(string(data), 0)
	if !ok {
		return fmt.Errorf("not a valid big integer: %s", data)
	}
	b.Int = z

	return nil
}
