using Microsoft.OpenApi.Models;

internal class BaseOpenApiReference : OpenApiReference
{
    public new string Type { get; set; }
    public new string Id { get; set; }
}