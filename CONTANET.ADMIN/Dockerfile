FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY ["CONTANET.ADMIN/CONTANET.ADMIN.csproj", "CONTANET.ADMIN/"]
COPY ["DAL/DAL.csproj", "DAL/"]
RUN dotnet restore "CONTANET.ADMIN/CONTANET.ADMIN.csproj"
COPY . .
WORKDIR "/src/CONTANET.ADMIN"
RUN dotnet build "CONTANET.ADMIN.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "CONTANET.ADMIN.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CONTANET.ADMIN.dll"]