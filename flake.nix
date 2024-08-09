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
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # nodejs and typescript
            nodePackages.nodejs
            nodePackages.pnpm
            nodePackages.typescript
            # tailwindcss
            nodePackages."@tailwindcss/language-server"
            # linter
            nodePackages.eslint
            nodePackages.eslint_d
          ];
        };
      };
    };
}
