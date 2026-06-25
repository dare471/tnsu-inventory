FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Directory.Build.props Directory.Packages.props ./
COPY src/Tnsu.Inventory.Domain/Tnsu.Inventory.Domain.csproj src/Tnsu.Inventory.Domain/
COPY src/Tnsu.Inventory.Application/Tnsu.Inventory.Application.csproj src/Tnsu.Inventory.Application/
COPY src/Tnsu.Inventory.Infrastructure/Tnsu.Inventory.Infrastructure.csproj src/Tnsu.Inventory.Infrastructure/
COPY src/Tnsu.Inventory.Api/Tnsu.Inventory.Api.csproj src/Tnsu.Inventory.Api/
RUN dotnet restore src/Tnsu.Inventory.Api/Tnsu.Inventory.Api.csproj
COPY src/ src/
RUN dotnet publish src/Tnsu.Inventory.Api/Tnsu.Inventory.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Tnsu.Inventory.Api.dll"]
