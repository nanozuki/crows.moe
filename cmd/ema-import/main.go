package main

import (
	"context"
	"encoding/json"
	"flag"
	"os"

	"github.com/rs/zerolog/log"
)

var (
	input  string
	dryRun bool
)

func init() {
	flag.StringVar(&input, "input", "", "input file path")
	flag.BoolVar(&dryRun, "dry-run", false, "dry run")
}

func main() {
	flag.Parse()
	if input == "" {
		log.Fatal().Msg("Usage: ema-import -input <input file path>")
	}
	f, err := os.Open(input)
	if err != nil {
		log.Fatal().Msgf("open input: %v", err)
	}
	var data EMAData
	if err := json.NewDecoder(f).Decode(&data); err != nil {
		log.Fatal().Msgf("unmarshal input: %v", err)
	}
	importer := NewImporter()
	ctx := context.Background()
	importer.importEMAData(ctx, data)
}
