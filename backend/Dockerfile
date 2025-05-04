FROM mcr.microsoft.com/dotnet/sdk:8.0

# Create a non-root user and group
RUN useradd -m appuser

# Set working directory
WORKDIR /app

# Install dotnet watch tool
RUN dotnet tool install --global dotnet-watch
ENV PATH="${PATH}:/root/.dotnet/tools"

# Restore dependencies
COPY ./src/*.csproj ./
RUN dotnet restore

# Copy the rest of the source code
COPY ./src/ ./

# Expose port (match the one used in the app)
EXPOSE 8000

# Use dotnet watch for hot reload
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8000"]
