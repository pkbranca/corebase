FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY ["CONTANET/CONTANET.csproj", "CONTANET/"]
COPY ["DAL/DAL.csproj", "CONTANET/"]
RUN dotnet restore "CONTANET/CONTANET.csproj"
COPY . .
WORKDIR "/src/CONTANET"
RUN dotnet build "CONTANET.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "CONTANET.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CONTANET.dll"]