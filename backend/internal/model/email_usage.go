package model

import "time"

type DailyEmailUsage struct {
	Date  time.Time `json:"date"`
	Count int       `json:"count"`
}
