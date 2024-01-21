package main

import (
	"context"
	"flag"

	"github.com/nanozuki/crows.moe/cmd/ema-import/fsdata"
	"github.com/nanozuki/crows.moe/cmd/ema-import/fsdata21"
	"github.com/nanozuki/crows.moe/cmd/ema-import/pgdata"
	"github.com/rs/zerolog/log"
)

const usage = `
Usage:
	ema-import -op import -input <input file path> [-apply]
	ema-import -op convert -2021 -input <input file path> -output <output file path>
	ema-import -op export -output <output file path>
`

var (
	op     string
	input  string
	output string
	apply  bool
)

func init() {
	flag.StringVar(&op, "op", "", "operation")
	flag.StringVar(&input, "input", "", "input file path")
	flag.StringVar(&output, "output", "", "output file path")
	flag.BoolVar(&apply, "apply", false, "apply changes to firestore")
}

func main() {
	flag.Parse()
	switch op {
	case "import":
		emaData, err := fsdata.NewEMADataFromFile(input)
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		importer := fsdata.NewStore(!apply)
		ctx := context.Background()
		importer.ImportEMAData(ctx, emaData)
	case "convert":
		data2021, err := fsdata21.NewDataFromDirectory(input)
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		emaData, err := data2021.ToEMAData()
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		if err := emaData.SaveToFile(output); err != nil {
			log.Fatal().Msg(err.Error())
		}
	case "export":
		store, err := pgdata.NewStoreFromFirestore(context.Background())
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		if err := store.WriteToFile(output); err != nil {
			log.Fatal().Msg(err.Error())
		}
	default:
		log.Fatal().Msg(usage)
	}
}
