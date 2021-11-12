﻿using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Queues;
using Microsoft.Extensions.Options;
using PowerBiAuditApp.Client.Models;

namespace PowerBiAuditApp.Client.Services
{
    public class QueueTriggerService : IQueueTriggerService
    {
        private readonly QueueServiceClient _queueServiceClient;
        private readonly IOptions<StorageAccountSettings> _settings;

        public QueueTriggerService(IOptions<StorageAccountSettings> settings, QueueServiceClient queueServiceClient)
        {
            _settings = settings;
            _queueServiceClient = queueServiceClient;
        }

        public async Task<QueueClient> GetTriggerQueue(CancellationToken cancellationToken = default)
        {
            var client = _queueServiceClient.GetQueueClient(_settings.Value.TriggerQueueName?.ToLower());
            await client.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
            return client;
        }

        public async Task SendQueueMessage(QueueClient queueClient, string message, CancellationToken cancellationToken = default) =>
            await queueClient.SendMessageAsync(message, cancellationToken: cancellationToken);
    }
}