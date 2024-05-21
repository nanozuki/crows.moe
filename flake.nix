{
  description = "Description for the project";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      perSystem = { config, self', inputs', pkgs, system, ... }: {
        _module.args.pkgs = import inputs.nixpkgs {
          inherit system;
          config = { allowUnfree = true; allowUnfreePredicate = (_: true); };
        };
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # terraform
            terraform
            terraform-ls
            # nodejs and typescript
            nodePackages.nodejs
            nodePackages.pnpm
            nodePackages.typescript
            # tailwindcss
            nodePackages."@tailwindcss/language-server"
            # linter
            nodePackages.eslint
            nodePackages.eslint_d
            # svelte
            nodePackages.svelte-language-server
            nodePackages.svelte-check
            # go
            gofumpt # formatter
            golangci-lint # linter
            gomodifytags
            gopls # language server
            gotests
            gotestsum
            gotools
            iferr
            impl
          ];
        };
      };
    };
}
