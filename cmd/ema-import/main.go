package main

import (
	"context"
	"encoding/json"
	"flag"

	"github.com/rs/zerolog/log"
)

var input string

func init() {
	flag.StringVar(&input, "input", "", "input file path")
}

func main() {
	flag.Parse()
	if input == "" {
		log.Fatal().Msg("Usage: ema-import -input <input file path>")
	}
	var data EMAData
	if err := json.Unmarshal([]byte(input), &data); err != nil {
		log.Fatal().Msgf("unmarshal input: %v", err)
	}
	importer := NewImporter()
	ctx := context.Background()
	importer.importEMAData(ctx, &data)
}

